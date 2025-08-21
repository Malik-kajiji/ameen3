const mongoose = require('mongoose');

const schema = mongoose.Schema;

const reportSchema = new schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['membership', 'financial', 'equipment', 'employee', 'attendance', 'revenue', 'custom']
    },
    description: {
        type: String,
        default: ''
    },
    dateRange: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    filters: [{
        type: String
    }],
    includeCharts: {
        type: Boolean,
        default: true
    },
    includeDetails: {
        type: Boolean,
        default: true
    },
    format: {
        type: String,
        enum: ['PDF', 'Excel', 'Word'],
        default: 'PDF'
    },
    schedule: {
        enabled: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            default: 'monthly'
        },
        dayOfMonth: {
            type: Number,
            min: 1,
            max: 31,
            default: 1
        },
        dayOfWeek: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            default: 'monday'
        },
        time: {
            type: String,
            default: '09:00'
        }
    },
    status: {
        type: String,
        enum: ['مجدول', 'نشط', 'معلق', 'ملغي'],
        default: 'نشط'
    },
    lastGenerated: {
        type: Date
    },
    nextRun: {
        type: Date
    }
}, { timestamps: true });

// Helper method to calculate next run date based on schedule
reportSchema.methods.calculateNextRun = function() {
    if (!this.schedule.enabled) {
        return null;
    }

    const now = new Date();
    let nextRun = new Date();
    const [hours, minutes] = this.schedule.time.split(':');
    
    nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    switch (this.schedule.frequency) {
        case 'daily':
            if (nextRun <= now) {
                nextRun.setDate(nextRun.getDate() + 1);
            }
            break;
            
        case 'weekly':
            const days = {
                'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
                'friday': 5, 'saturday': 6, 'sunday': 0
            };
            const targetDay = days[this.schedule.dayOfWeek];
            while (nextRun.getDay() !== targetDay || nextRun <= now) {
                nextRun.setDate(nextRun.getDate() + 1);
            }
            break;
            
        case 'monthly':
            nextRun.setDate(this.schedule.dayOfMonth);
            if (nextRun <= now) {
                nextRun.setMonth(nextRun.getMonth() + 1);
            }
            break;
            
        case 'yearly':
            nextRun.setMonth(0, this.schedule.dayOfMonth);
            if (nextRun <= now) {
                nextRun.setFullYear(nextRun.getFullYear() + 1);
            }
            break;
    }
    
    return nextRun;
};

// Pre-save middleware to update nextRun date
reportSchema.pre('save', function(next) {
    if (this.schedule.enabled) {
        this.nextRun = this.calculateNextRun();
    }
    next();
});

// Static method to get reports by type
reportSchema.statics.getReportsByType = async function(type) {
    return this.find({ type }).sort({ createdAt: -1 });
};

// Static method to get scheduled reports
reportSchema.statics.getScheduledReports = async function() {
    return this.find({
        'schedule.enabled': true,
        status: { $ne: 'ملغي' }
    }).sort({ nextRun: 1 });
};

// Static method to get reports due for generation
reportSchema.statics.getDueReports = async function() {
    const now = new Date();
    return this.find({
        'schedule.enabled': true,
        status: 'مجدول',
        nextRun: { $lte: now }
    });
};

module.exports = mongoose.model('report', reportSchema);