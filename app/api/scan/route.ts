import { auth , currentUser} from '@clerk/nextjs/server'
import { prisma } from "../../../lib/prisma";
import { NextResponse } from 'next/server'
export async function POST(req:Request){
    const { userId } =  await auth();
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "no-email";
    if (!userId) return new Response("Unauthorized", { status: 401 });
    const { productName, companyName, ingredients, score, warnings } =
    await req.json();
   const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email }, // keep email in sync in case it changes
    create: { clerkId: userId, email },
   })
   const scan = await prisma.scan.create({
    data: {
      productName,
      companyName,
      ingredients,
      score,
      warnings,
      userId: user.id,
    },
  });
  return NextResponse.json(scan);
}
