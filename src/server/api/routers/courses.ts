import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  getCourseList: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.course.findMany({
      orderBy: {
        name: "asc",
      },
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
              orderBy: {
                title: "asc",
              },
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
  getChapterName: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const courseName = await ctx.prisma.courseChapter.findFirst({
        where: {
          id: input.id,
        },
        select: {
          title: true,
        },
      });
      return courseName?.title ?? null;
    }),
  getChapterData: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.courseChapter.findFirstOrThrow({
          where: {
            id: input.chapterId,
          },
          select: {
            id: true,
            title: true,
            videos: {
              orderBy: {
                title: "asc",
              },
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        return data;
      } catch (e) {
        return null;
      }
    }),
});
