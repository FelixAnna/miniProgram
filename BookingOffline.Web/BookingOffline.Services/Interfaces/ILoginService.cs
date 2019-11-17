using BookingOffline.Services.Models;

namespace BookingOffline.Services
{
    public interface ILoginService
    {
        LoginResultModel LoginMiniAlipay(string code);
    }
}