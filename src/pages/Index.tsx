import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Calendar, Stethoscope, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, upcoming: 0 });

  useEffect(() => {
    const load = async () => {
      const nowIso = new Date().toISOString();
      const [d, p, a, u] = await Promise.all([
        supabase.from("doctors").select("*", { count: "exact", head: true }),
        supabase.from("patients").select("*", { count: "exact", head: true }),
        supabase.from("appointments").select("*", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("appointment_date", nowIso),
      ]);
      setStats({
        doctors: d.count ?? 0,
        patients: p.count ?? 0,
        appointments: a.count ?? 0,
        upcoming: u.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Doctors", value: stats.doctors, icon: Stethoscope, to: "/doctors" },
    { label: "Patients", value: stats.patients, icon: Users, to: "/patients" },
    { label: "Total Appointments", value: stats.appointments, icon: Calendar, to: "/appointments" },
    { label: "Upcoming", value: stats.upcoming, icon: Activity, to: "/appointments" },
  ];

  return (
    <div>
      <section className="mb-10 overflow-hidden rounded-2xl bg-gradient-hero p-8 text-primary-foreground shadow-card sm:p-12">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider opacity-80">
            Hospital Management
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to MediCare HMS
          </h1>
          <p className="mt-3 text-base opacity-90 sm:text-lg">
            Manage doctors, patients, and appointments — all in one clean, simple place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link to="/doctors">Manage Doctors</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/appointments">View Appointments</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="transition-shadow hover:shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <c.icon className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{c.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;
