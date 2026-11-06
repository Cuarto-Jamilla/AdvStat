export async function POST() {
  const response = Response.json({
    success: true,
    message: 'Logged out successfully.',
  });

  response.headers.append(
    'Set-Cookie',
    'advstat_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'
  );

  return response;
}