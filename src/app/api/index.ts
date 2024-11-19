import { PrismaClient } from "@prisma/client";

const db=new PrismaClient();

const getUsers=db.employee.findMany()



console.log(getUsers)