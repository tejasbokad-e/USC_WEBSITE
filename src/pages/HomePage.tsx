import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Trophy, Users, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="container px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <span className="text-primary font-bold text-2xl">IX</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            USC IX Management Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive organizational management and study platform for managing members, academic materials, departments, groups, and leadership hierarchy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" variant="outline">
              <Link to="/setup">🔧 Setup Platform</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/materials/public">Browse Materials</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground">Everything you need for organizational excellence</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>
                Access and manage academic PDFs and learning resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Public materials available without login. Members get access to exclusive internal resources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Leaderboard System</CardTitle>
              <CardDescription>
                Track performance and rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View member rankings based on scores across different departments and activities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Group Management</CardTitle>
              <CardDescription>
                Organize members into groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Three groups (G1, G2, G3) with dedicated group leaders for coordination.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure hierarchical system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                President, Department Heads, Group Leaders, and Members with appropriate permissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Departments Section */}
      <div className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Departments</h2>
          <p className="text-muted-foreground">Four specialized departments serving the organization</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Enhancement Board</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manages academic study materials and educational programs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sports Department</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Oversees sports activities and athletic programs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Department</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coordinates organizational activities and events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HR Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Handles human resources and member management
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container py-8 px-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 USC IX Management Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
