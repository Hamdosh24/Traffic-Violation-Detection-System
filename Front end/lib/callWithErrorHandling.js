export const callWithErrorHandling = async ({ callback, errorMessage }) => {
  try {
    await callback();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
};
