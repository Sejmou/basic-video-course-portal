import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.course.findFirstOrThrow({
          where: {
            id: input.courseId,
          },
          select: {
            id: true,
            name: true,
            chapters: {
              select: {
                id: true,
                title: true,
                _count: {
                  select: {
                    videos: true,
                  },
                },
              },
            },
          },
        });
        return {
          id: data.id,
          name: data.name,
          chapters: data.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            videoCount: chapter._count.videos,
          })),
        };
      } catch (e) {
        return null;
      }
    }),
  getCourseName: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const courseName = await ctx.prisma.course.findFirst({
        where: {
          id: input.id,
        },
        select: {
          name: true,
        },
      });
      return courseName?.name ?? null;
    }),
});
