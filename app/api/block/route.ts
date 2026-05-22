import { NextRequest, NextResponse } from "next/server";
import { blockDomain } from "@/lib/adguard";

export async function POST(req: NextRequest) {
try {
const body = await req.json();

```
await blockDomain(body.domain);

return NextResponse.json({
  success: true,
});
```

} catch (error) {
return NextResponse.json(
{
success: false,
error,
},
{ status: 500 }
);
}
}
