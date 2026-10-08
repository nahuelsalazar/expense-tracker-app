interface HttpResponse {
  ok: boolean;
  status: number;
  data: any;
}

export const jsonResponse = (
  statusCode: number,
  data: any = null,
): HttpResponse => {
  const isSuccess = statusCode >= 200 && statusCode < 300;

  return {
    ok: isSuccess,
    status: statusCode,
    data:
      data ??
      (statusCode >= 500
        ? { detail: "Ocurrió un error interno en el servidor." }
        : null),
  };
};
