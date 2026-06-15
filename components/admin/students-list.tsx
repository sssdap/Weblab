"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthUser } from "@/lib/types/auth.types";
import {
  getStudents,
  getStudentCompletedCoursesCount,
  formatRegistrationDate,
} from "@/services/user.service";

interface StudentWithCourses extends AuthUser {
  completedCourses: number;
}

export function StudentsList() {
  const [students, setStudents] = useState<StudentWithCourses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedStudents = await getStudents();

        // Загружаем количество пройденных курсов для каждого ученика
        const studentsWithCourses = await Promise.all(
          fetchedStudents.map(async (student) => ({
            ...student,
            completedCourses: await getStudentCompletedCoursesCount(student.id),
          })),
        );

        setStudents(studentsWithCourses);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(
          err instanceof Error ? err.message : "Ошибка при загрузке учеников",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Список учеников</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={loading}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Загрузка учеников...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              Учеников не найдено
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              По вашему запросу ничего не найдено
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {filteredStudents.map((student) => {
                const initials = student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={student.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
                        {student.avatar && (
                          <AvatarImage src={student.avatar} alt={student.name} />
                        )}
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {student.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          student.completedCourses > 0 ? "default" : "secondary"
                        }
                        className="shrink-0 text-xs"
                      >
                        {student.completedCourses}
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Регистрация:{" "}
                      {formatRegistrationDate(student.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ученик</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">
                      Пройдено курсов
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const initials = student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();

                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                              {student.avatar && (
                                <AvatarImage
                                  src={student.avatar}
                                  alt={student.name}
                                />
                              )}
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatRegistrationDate(student.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              student.completedCourses > 0
                                ? "default"
                                : "secondary"
                            }
                          >
                            {student.completedCourses}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && students.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            Показано {filteredStudents.length} из {students.length} учеников
          </div>
        )}
      </CardContent>
    </Card>
  );
}
