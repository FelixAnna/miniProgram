using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace BookingOffline.Web.Configuration
{
    public class GlobalExceptionHandler
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionHandler(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}
