import * as fs from "fs";
import path from "path";
import { Event } from "@prisma/client";

export const loadEventsData = (): Event[] => {
  const rawdata = fs.readFileSync(path.resolve(__dirname, "./testdata.json"));
  return JSON.parse(rawdata.toString());
};
