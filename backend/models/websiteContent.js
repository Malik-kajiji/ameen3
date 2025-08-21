const mongoose = require('mongoose');

const websiteContentSchema = new mongoose.Schema({
  about: {
    title: {
      type: String,
      required: true,
      default: "مرحّب بيك في عالم الورشة"
    },
    content: {
      type: String,
      required: true,
      default: "في قلب طرابلس، وتحديدًا في حي المشتل، تلقى \"الورشة GYM\"… مش بس صالة، بل عالم متكامل للّي يبي يغيّر من نفسه ويعيش تجربة رياضية حقيقية."
    }
  },
  features: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }],
  trainingDays: [{
    day: {
      type: String,
      required: true
    },
    firstShift: {
      type: String,
      required: true
    },
    secondShift: {
      type: String,
      required: true
    },
    thirdShift: {
      type: String,
      required: true
    }
  }],
  packages: [{
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    period: {
      type: Number,
      required: true
    },
    benefits: [{
      type: String,
      required: true
    }]
  }],
  contact: {
    address: {
      type: String,
      required: true,
      default: "طرابلس، حي المشتل"
    },
    phone: {
      type: String,
      required: true,
      default: "+218 91-XXXXXXX"
    },
    email: {
      type: String,
      required: true,
      default: "contact@alwarsha.ly"
    },
    socialMedia: {
      facebook: String,
      instagram: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteContent', websiteContentSchema);