import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Users, Calendar } from 'lucide-react';

const plans = [
  {
    id: 1,
    name: "Monthly",
    price: "170",
    duration: "1 Month",
    popular: false,
    pauseDays: "3 Days",
    friendDays: "2 Days",
    features: [
      "24/7 Gym Access",
      "All Equipment Access",
      "3 Pause Days",
      "2 Bring a Friend Days",
      "Locker Access",
      "Shower Facilities"
    ]
  },
  {
    id: 2,
    name: "3 Months",
    price: "450",
    duration: "3 Months",
    popular: true,
    pauseDays: "10 Days",
    friendDays: "6 Days",
    features: [
      "24/7 Gym Access",
      "All Equipment Access",
      "10 Pause Days",
      "6 Bring a Friend Days",
      "Locker Access",
      "Shower Facilities",
      "1 Free Training Session"
    ]
  },
  {
    id: 3,
    name: "6 Months",
    price: "750",
    duration: "6 Months",
    popular: false,
    pauseDays: "20 Days",
    friendDays: "12 Days",
    features: [
      "24/7 Gym Access",
      "All Equipment Access",
      "20 Pause Days",
      "12 Bring a Friend Days",
      "Locker Access",
      "Shower Facilities",
      "2 Free Training Sessions",
      "Fitness Assessment"
    ]
  },
  {
    id: 4,
    name: "Yearly",
    price: "1200",
    duration: "12 Months",
    popular: false,
    pauseDays: "45 Days",
    friendDays: "24 Days",
    features: [
      "24/7 Gym Access",
      "All Equipment Access",
      "45 Pause Days",
      "24 Bring a Friend Days",
      "Locker Access",
      "Shower Facilities",
      "Monthly Training Session",
      "Quarterly Fitness Assessment",
      "Nutritional Consultation"
    ]
  }
];

const PlansSection = () => {
  return (
    <section id="plans" className="py-20 bg-secondary/50 rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your <span className="text-gradient">Perfect Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible membership plans designed to fit your lifestyle and fitness goals. 
            All plans include our unique pause and bring-a-friend features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative group transition-transform duration-200 ${
                plan.popular ? 'z-10' : 'z-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground px-4 py-1 rounded-full text-sm font-medium shadow-lg border border-primary">
                    Most Popular
                  </span>
                </div>
              )}

              <Card 
                className={`h-full card-gradient border-primary/10 group-hover:scale-105 transition-all shadow ${
                  plan.popular ? 'border-primary scale-105 ring-2 ring-primary/20' : ''
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      {plan.price} <span className="text-lg text-muted-foreground">LYD</span>
                    </div>
                    <p className="text-muted-foreground">{plan.duration}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium">{plan.pauseDays}</div>
                      <div className="text-xs text-muted-foreground">Pause Days</div>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium">{plan.friendDays}</div>
                      <div className="text-xs text-muted-foreground">Friend Days</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full py-2 px-6 text-lg font-bold rounded-xl ${
                      plan.popular 
                        ? 'btn-gradient hover:opacity-90' 
                        : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            All plans include 24/7 access and can be paused based on your subscription type
          </p>
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Compare All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
