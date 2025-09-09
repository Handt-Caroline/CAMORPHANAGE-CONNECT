// FILE: src/app/api/auth/[...nextauth]/route.ts
// This is the only code that should be in this file.

import { handlers } from "@/auth";
export const { GET, POST } = handlers;