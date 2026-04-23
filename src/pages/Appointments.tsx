import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}
interface Patient {
  id: string;
  name: string;
}
interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  doctors: { name: string; specialization: string } | null;
  patients: { name: string } | null;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ doctor_id: "", patient_id: "", appointment_date: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [a, d, p] = await Promise.all([
      supabase
        .from("appointments")
        .select("id, doctor_id, patient_id, appointment_date, doctors(name, specialization), patients(name)")
        .order("appointment_date", { ascending: true }),
      supabase.from("doctors").select("id, name, specialization").order("name"),
      supabase.from("patients").select("id, name").order("name"),
    ]);
    if (a.error) toast.error("Failed to load appointments");
    else setAppointments((a.data ?? []) as unknown as Appointment[]);
    if (d.data) setDoctors(d.data);
    if (p.data) setPatients(p.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctor_id || !form.patient_id || !form.appointment_date) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert([
      {
        doctor_id: form.doctor_id,
        patient_id: form.patient_id,
        appointment_date: new Date(form.appointment_date).toISOString(),
      },
    ]);
    setSubmitting(false);
    if (error) {
      toast.error("Failed to create appointment");
      return;
    }
    toast.success("Appointment created");
    setForm({ doctor_id: "", patient_id: "", appointment_date: "" });
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete appointment");
      return;
    }
    toast.success("Appointment deleted");
    load();
  };

  const noResources = doctors.length === 0 || patients.length === 0;

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Schedule and manage doctor-patient appointments."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={noResources}>
                <Plus className="mr-2 h-4 w-4" /> New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <Select
                    value={form.doctor_id}
                    onValueChange={(v) => setForm({ ...form, doctor_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} — {d.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Patient</Label>
                  <Select
                    value={form.patient_id}
                    onValueChange={(v) => setForm({ ...form, patient_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={form.appointment_date}
                    onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Appointment"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {noResources && !loading && (
        <div className="mb-6 rounded-lg border border-border bg-accent/50 p-4 text-sm text-accent-foreground">
          You need at least one doctor and one patient before creating appointments.
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  <CalendarIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  No appointments scheduled yet.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">
                    {new Date(a.appointment_date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {a.doctors ? (
                      <span>
                        {a.doctors.name}{" "}
                        <span className="text-muted-foreground">— {a.doctors.specialization}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Removed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {a.patients ? a.patients.name : <span className="text-muted-foreground italic">Removed</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this appointment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(a.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Appointments;
