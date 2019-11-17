using BookingOffline.Common;
using BookingOffline.Services.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BookingOffline.Services
{
    public class LoginService : ILoginService
    {
        private TokenGeneratorService _tokenService;
        private AlipayService _alipayService;
        public LoginService(TokenGeneratorService tokenService, AlipayService alipayService)
        {
            this._tokenService = tokenService;
            this._alipayService = alipayService;
        }

        public LoginResultModel LoginMiniAlipay(string code)
        {
            var response = _alipayService.GetUserIdByCode(code);
            if (response.IsError)
            {
                Console.WriteLine(response.Body);
                return null;
            }

            var tokenStr = _tokenService.CreateJwtToken();
            var result = new LoginResultModel()
            {
                BOToken = tokenStr,
                AccessToken = response.AccessToken,
                AlipayUserId = response.AlipayUserId,
                ExpiresIn = response.ReExpiresIn,
                ReExpiresIn = response.ReExpiresIn,
                RefreshToken = response.RefreshToken,
                UserId = response.UserId
            };

            return result;
        }
    }
}
