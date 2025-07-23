import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';

const trainers = [
  {
    id: 1,
    name: "Ahmed Hassan",
    specialty: "Strength Training & Bodybuilding",
    experience: "8 Years",
    schedule: "Mon, Wed, Fri: 6AM-2PM",
    image: "/placeholder.svg",
    bio: "NASM-certified trainer specializing in strength training and muscle building."
  },
  {
    id: 2,
    name: "Sara Mohamed",
    specialty: "Cardio & Weight Loss",
    experience: "5 Years",
    schedule: "Tue, Thu, Sat: 8AM-4PM",
    image: "/placeholder.svg",
    bio: "Expert in cardio training and sustainable weight loss programs."
  },
  {
    id: 3,
    name: "Omar Khalil",
    specialty: "Functional Training",
    experience: "6 Years",
    schedule: "Mon-Fri: 10AM-6PM",
    image: "/placeholder.svg",
    bio: "Specializes in functional movement and athletic performance training."
  },
  {
    id: 4,
    name: "Fatima Ali",
    specialty: "Yoga & Flexibility",
    experience: "4 Years",
    schedule: "Daily: 7AM-3PM",
    image: "/placeholder.svg",
    bio: "Certified yoga instructor focusing on flexibility and mind-body connection."
  }
];

const TrainersSection = () => {
  return (
    <section id="trainers" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Meet Our <span className="text-gradient">Expert Trainers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our certified trainers are here to guide you every step of the way,
            ensuring you reach your fitness goals safely and effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, index) => (
            <Card
              key={trainer.id}
              className="card-gradient border-primary/10 hover:border-primary/30 transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{trainer.name}</h3>
                  <p className="text-primary font-medium text-sm">{trainer.specialty}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">{trainer.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{trainer.schedule}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {trainer.bio}
                </p>

                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
