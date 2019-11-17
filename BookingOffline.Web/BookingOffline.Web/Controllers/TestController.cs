using BookingOffline.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingOffline.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private TokenGeneratorService _tokenService;
        private AlipayService _alipayService;
        public TestController(TokenGeneratorService tokenService, AlipayService alipayService)
        {
            this._tokenService = tokenService;
            this._alipayService = alipayService;
        }

        [AllowAnonymous]
        [HttpGet("token")]
        public IActionResult Index()
        {
            // authentication successful so generate jwt token
            var tokenStr = _tokenService.CreateJwtToken();
            return Ok(new { token = tokenStr });
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult Protected()
        {
            return Ok(new { State = "succeed" });
        }
    }
}