import { NextRequest, NextResponse } from 'next/server';

export class Controller {
  protected async validate(request: NextRequest, rules: any) {
    // Validation logic here
    return true;
  }

  protected success(data: any, message?: string, status = 200) {
    return NextResponse.json({
      success: true,
      message,
      data,
    }, { status });
  }

  protected error(message: string, status = 400, errors?: any) {
    return NextResponse.json({
      success: false,
      message,
      errors,
    }, { status });
  }
}
