"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { getAcademicYearById } from "@/lib/api/academic-years";

interface AcademicYearModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AcademicYearModal({
  id,
  open,
  onOpenChange,
}: AcademicYearModalProps) {
  const [academicYear, setAcademicYear] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const fetchAcademicYear = async () => {
      setLoading(true);
      try {
        const data = await getAcademicYearById(Number(id));
        setAcademicYear(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch academic year");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicYear();
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Academic Year Details</DialogTitle>
          <DialogDescription>{loading ? "Loading..." : ""}</DialogDescription>
        </DialogHeader>

        {!loading && academicYear && (
          <div className="space-y-4 mt-2">
            <Table className="w-full">
              <TableBody>

                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{academicYear.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Start Date</TableCell>
                  <TableCell>{academicYear.start_date}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">End Date</TableCell>
                  <TableCell>{academicYear.end_date}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="capitalize">{academicYear.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell className="capitalize">{academicYear.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Updated At</TableCell>
                  <TableCell className="capitalize">{academicYear.updated_at}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-primary text-white shadow-none hover:bg-primary hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}