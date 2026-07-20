export const POST = async (request) => {
    try {
        const { checkoutUrl } = await request.json();

        if (!checkoutUrl) {
            return Response.json(
                {
                    success: false,
                    message: "Checkout URL is required",
                },
                {
                    status: 400,
                }
            );
        }

        const parsedCheckoutUrl = new URL(checkoutUrl);

        if (
            parsedCheckoutUrl.protocol !== "https:" &&
            parsedCheckoutUrl.protocol !== "http:"
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid checkout URL",
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json(
            {
                success: true,
                checkoutUrl: parsedCheckoutUrl.toString(),
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to prepare checkout",
            },
            {
                status: 500,
            }
        );
    }
};