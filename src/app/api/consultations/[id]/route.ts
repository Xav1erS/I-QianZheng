import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 用普通客户端验证登录态
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // 用 admin client 执行删除（绕过 RLS），手动校验所有权
  const admin = createAdminClient();
  const { error } = await admin
    .from("consultations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // 手动确保只能删自己的记录

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
