import { PrismaClient } from "@prisma/client";

export type QueryFunction<ReturnType> = () => Promise<ReturnType>;
export type Executor<ReturnType> = (
  queryFunction: QueryFunction<ReturnType>
) => Promise<ReturnType>;

export async function getExecutor<ReturnType>(
  prisma: PrismaClient
): Promise<Executor<ReturnType>> {
  return async (
    queryFunction: QueryFunction<ReturnType>
  ): Promise<ReturnType> => {
    try {
      return await queryFunction();
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
    } finally {
      await prisma.$disconnect();
    }
  };
}
