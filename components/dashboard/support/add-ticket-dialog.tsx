"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createTicket } from "@/lib/actions/dashboard/support";
import { toast } from "sonner";

export function AddTicketDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        priority: "medium" as "low" | "medium" | "high",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.subject.trim() || !formData.message.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        const result = await createTicket(formData);

        if (result.success) {
            toast.success("Ticket created successfully");
            setOpen(false);
            setFormData({ subject: "", message: "", priority: "medium" });
            router.refresh();
        } else {
            toast.error(result.error || "Failed to create ticket");
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Support Ticket</DialogTitle>
                        <DialogDescription>
                            Submit a support ticket to get help from the admin team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subject">
                                Subject <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Brief description of your issue"
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData({ ...formData, subject: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: "low" | "medium" | "high") =>
                                    setFormData({ ...formData, priority: value })
                                }
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">
                                Message <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Describe your issue in detail..."
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({ ...formData, message: e.target.value })
                                }
                                rows={5}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-700"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Ticket"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
