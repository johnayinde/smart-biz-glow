import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We put our customers at the center of everything we do, building features that truly matter to their success."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly push boundaries to create better, more efficient solutions for modern businesses."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our product, from design to functionality."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about helping businesses grow and succeed through better financial management."
    }
  ];

  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      bio: "Serial entrepreneur with 15+ years in fintech and business automation."
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      bio: "Former Google engineer passionate about building scalable, user-friendly platforms."
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      bio: "Award-winning designer focused on creating intuitive user experiences."
    },
    {
      name: "Emily Rodriguez",
      role: "VP of Customer Success",
      bio: "Customer advocate ensuring every user gets maximum value from our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-4">About InvoiceApp</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            We're on a mission to simplify financial management for businesses of all sizes, 
            making professional invoicing accessible to everyone.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                InvoiceApp was born out of frustration with complex, expensive invoicing solutions that 
                seemed designed for large corporations rather than the small businesses and freelancers 
                who make up the backbone of our economy.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Founded in 2023, we started with a simple belief: invoicing shouldn't be complicated. 
                Every business owner should be able to create professional invoices, track payments, 
                and manage their cash flow without needing a degree in accounting or a team of consultants.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve thousands of businesses worldwide, from solo freelancers 
                to growing agencies, helping them save time, get paid faster, and focus on what they do best.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind InvoiceApp, dedicated to your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
            To empower every business owner with simple, powerful tools that make financial management 
            effortless, so they can focus on growing their business and serving their customers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-4xl font-bold mb-2">50K+</h3>
              <p className="opacity-90">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">$10M+</h3>
              <p className="opacity-90">Invoices Processed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">150+</h3>
              <p className="opacity-90">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using InvoiceApp to streamline their billing process.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;