import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  getCourseList: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.course.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      chapterCount: course._count.chapters,
    }));
  }),
  getCourseData: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.courseChapter.findMany({
        select: {
          id: true,
          title: true,
          videos: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      return data;
    }),
});
