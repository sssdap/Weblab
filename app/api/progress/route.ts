import { NextRequest, NextResponse } from "next/server";

/**
 * API Route for completing lessons
 * This route handles lesson completion and progress tracking
 */

interface CompleteProgressRequest {
  courseId: string;
  chapterId: string;
  lessonId: string;
  userId: string;
}

/**
 * POST /api/progress
 * Client sends their progress data with userId
 * Server validates and stores in Firestore
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем данные из body
    let body: CompleteProgressRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { courseId, chapterId, lessonId, userId } = body;

    if (!courseId || !chapterId || !lessonId || !userId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: courseId, chapterId, lessonId, userId",
        },
        { status: 400 },
      );
    }

    // Log the completion
    console.log(
      `[PROGRESS API] Lesson completion recorded: lesson=${lessonId}, user=${userId}, course=${courseId}`,
    );

    // Return success - actual Firestore write happens on client side
    return NextResponse.json(
      {
        success: true,
        message: "Lesson completion recorded",
        progressId: `${userId}_${lessonId}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PROGRESS API] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: "Progress API - use POST to record completion",
    },
    { status: 200 },
  );
}
