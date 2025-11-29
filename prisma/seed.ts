import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

const courseDataValidator = z.array(
  z.object({
    courseName: z.string(),
    content: z.array(
      z.object({
        title: z.string(),
        videoData: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
          })
        ),
      })
    ),
  })
);

async function processFile(filename: string) {
  console.log("processing file", filename);
  const file = await fs.readFile(path.join(__dirname, filename), "utf-8");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const content = JSON.parse(file);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return content;
}

const prisma = new PrismaClient();
async function main() {
  const courseData = courseDataValidator.parse(
    await processFile("course-data.json")
  );

  for (const course of courseData) {
    const courseName = course.courseName.replace(/^[0-9]+\.\s+/, "");
    // Find existing course or create new one
    let courseRecord = await prisma.course.findFirst({
      where: { name: courseName },
    });
    if (!courseRecord) {
      courseRecord = await prisma.course.create({
        data: {
          name: courseName,
        },
      });
    }

    for (const chapter of course.content) {
      chapter.title = chapter.title.slice(
        chapter.title.indexOf(" - ") + 3,
        chapter.title.length
      );
      // Find existing chapter or create new one
      let chapterRecord = await prisma.courseChapter.findFirst({
        where: {
          title: chapter.title,
          courseId: courseRecord.id,
        },
      });
      if (!chapterRecord) {
        chapterRecord = await prisma.courseChapter.create({
          data: {
            title: chapter.title,
            courseId: courseRecord.id,
          },
        });
      }

      for (const videoData of chapter.videoData) {
        const idxOfChapterName = videoData.title.indexOf(chapter.title);
        if (idxOfChapterName !== -1) {
          videoData.title = videoData.title.slice(
            idxOfChapterName + chapter.title.length + 1,
            videoData.title.length
          );
        }
        // Use upsert for videos since id is the primary key
        await prisma.video.upsert({
          where: { id: videoData.id },
          update: {
            title: videoData.title,
            chapterId: chapterRecord.id,
          },
          create: {
            id: videoData.id,
            title: videoData.title,
            chapterId: chapterRecord.id,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
