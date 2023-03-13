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
    const courseRecord = await prisma.course.create({
      data: {
        // replace numbers and dot at beginning of course name
        name: course.courseName.replace(/^[0-9]+\.\s+/, ""),
      },
    });

    for (const chapter of course.content) {
      const chapterRecord = await prisma.courseChapter.create({
        data: {
          title: chapter.title,
          courseId: courseRecord.id,
        },
      });

      for (const videoData of chapter.videoData) {
        await prisma.video.create({
          data: {
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
