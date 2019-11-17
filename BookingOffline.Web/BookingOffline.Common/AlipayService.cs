using Alipay.AopSdk.Core;
using Alipay.AopSdk.Core.Request;
using Alipay.AopSdk.Core.Response;

namespace BookingOffline.Common
{
    public class AlipayService
    {
        private const string privateKey = "MIIEowIBAAKCAQEAgD7p/d5QfJ38HkbCqHPZz7rCtlq9cqJqLVcpgWBW4tHSom46qv0/QAz30utX4UFC3GpfVY1p0hkCSzbixVmWdVEaBZqoad4VfABhjONFIsO0pF96wf+GOfCutpOYh8hOT42Qe0+oVs6fgV4Kdyp+cQDg0jOrKxHID+F2Pi7wHJUwhfIZNx47X5n27iC6xOfEfWCjqxVPzLGXhwJa/TidpkWXISCukZHQBZP6fRVDfUSqapnlyVoAdDbuAIWYh2gdaJtFXcaax8ZJBw+VpqtHk7Cb7BOv4SpPmCfFcS712OgJWV70KG1lZG6mC+jrwojfVAfQUCE7qET3vLYSZAy0AwIDAQABAoIBAD26CnYe4y6X/Bm2hUr/N/88LSwIUNc0RVa9dUTIUgmqZG+6DpLugdsaYs4qaIoLF1tv96L+BckSMIBzUoMas8iT2KqJ3jXWpxCgPlPJsCUjfXcAXd2yV7Dbn7xRHkF8r/SqdrhjhusBWNSzpuXklidd/Ngv9lssm9bI9ljHztpyW97U3AIPMeVUh3g52UVdCddK61VcX3NERHCA4KSGuJBa5NKclYg+4gbRtU6qo5EpzRohQC6kKDDxLoulqmHMZPqIcBUFyW8CIeJqtRITXgAI7xMNUfHN/E3oEmTF/RVk69tpbOfJ3NlrwEQRD4xrzktE+i68lwb0rwdpOjFrD8ECgYEA/q8cFxNsUIz12Qse4G+9Z91vPPWc+2aY9ZMQzoOGUOvZCF3N2c0UbIZAfdJs9uS1DF8Vc+H1RMwSKh8xx+w/xaFsr1lFeuNzYyAA1dwCvYJAnZXIVwl3G5jQZgh/uvo9MCP2mVPaPrbA5wuMyWeUHJ+rZ8jbhQ9ZrVjUMdWMrR0CgYEAgOiN+7h6Pooh5x3A+v8WoYpIxOm8uMasurcyAphpSFIgSyGVYNY+U+8Y03fzh4RkAHCN5750lZG7uGoGkeSIcSwpXuqudHNTNyboH3PZjqZzDV4Mt/cPN6qksjbRoA+KLlKlYcR7vYm0jK+VC1PJf5RTiMQd/0jmsn82uKvNu58CgYEAzbgSX41f23zRBN1XtoBrpN8XgE0A3Y0VFqARXk6dCvZG29wxb7GYwsR6iWeUfqVknLadNHqbTFPuhDmoU03AgVmP2d+pIMdip/ns0tIhIIR6vw+CwNMzc4YvJ4vL6PNCw4T5Jwa1bhzemoIY2YKh/7D1miKDNuqcTEpJNGvDcv0CgYAdjTJ/clsT2zbKdNe4sqHNhpYIDk1lTqZqZ3Tfg3EfUzR0BM7p1DOVqkpWsDjz6DXEpAjkB5VSdIZEUIoRCAL/btBNIh+8MnPxQMoV68kEGsRlXBouUkT6zfPTpx2HRAi5ddjUAOcdHGR3nAje/+ZBiQ9dWxhFXcEFSoSQ8VHIoQKBgCs+GZDoYbuJMa4G1JyeqY6jPzyFVlbYnm0hg6WGpVYQcMuFQup3MhrhCN/kQwVhkNlBw4/mCVZgV4Ddg/yfS/v9CkiMqnxBdqeb97GYJxP+OB81snnqYmaY+5BxmhIHZ1c1dYOLvE7yHT31u7x3BJzwnND/f7cbPsbeRht2YCRd";
            //"MIIEpAIBAAKCAQEAxHC73mV4mB3vwIKXGokMi0+/neYVOArgE7EHsynI4Ob+x4vscM6glHcW2Aog9ea9HO6xLkfQloPXE2OCf3ZQWWDngKN2tn9uglU6eIf0b8s69v/IgVvGkJxDoorQgbA/8FIoxBAMbfmmOtNGxUcRoJXNTJjTeVyP6twShp1A4XBt3PXrP+tH47wF4gTAwnndVhWe0CtutuPvIJvTSJFaoAoAzB1Xm/i9fxiGvSmvp8Vq30U92wQZgpNtLA+jlm4qlkembPl/ZdoyqmeNRbLDtFGu0DGYFUHo95K9EA7eubO7Y9dJslNZuMEzzhagyY7x+RceSEigi7HDcAfYJgGpcQIDAQABAoIBAQCq/tcKiJmpEKYalZKi7pmUyx6pfBcMaasUeQ2Sz9SksW8mlI6Ew9jUY7Xm6So341rLTJu/BZR08N7Pade2zG603r2mJKS5x8OSgE4djXshtW7mg1EuCY2XY+8cFmnZ+mot79a8lJu9P4uLuU3pfCvD9aJ4ArBS/FfqwRb/RvOrSIPyYEdYKAp1oLoSa7XLtodufZQ1jLeS9mwcUZoPhbfjodS/5G4OZLwVUspkwBZnHq70MD/k4tRUdR+r7ytdu3icQl6B+03QtEEBcWasnbxL4GexvlBOVoICLWrw+mCX7i+HMkLUnBZ7G5NEuXtL5IzwAUATpZ4nWiIM7Hx/NxABAoGBAOvEQ1j9yBjEYNqF328YYiug8XS5bFnk9drZD6wTwlPn3CRfRSbs2veshTTtN0TFR5PedyRLp9wqB/7fWTfXNk19vIR3zahEqXR1ugMeDrfZUs9FS4aH0Qos+/dxvUpLsM9S7/VY5tlZVbL8ZwDGHbM1r6jNrlEpmiKoOPBY6dhhAoGBANVMe1BqootJhhtMd7UlEK38xj0sY8QC8SKE8i/jkaP9UGUNIYGf/XO2ASNAqRitn+Gd1V6ABNrEz7F/uymrcVip2gcMpDZs0lHDcJTl0SsCUglbIBK3YH+eU8vWFTCL9QgLJtOngqM8HxSLaMJYYak4lqqfzhrpXFVlRTliYisRAoGBAInRkqTkxSFlOlDDTRc+I7TpQfw/oAz0gJtLo5OtgT1XHiLM5jmY329ElCGaQWKcB/lyZCb9asSSdVYR7a9syLuHsrmk5r1kVcJUR0YnPedOzM+I7FtZ7WKLZUcCX+qcUGEBVHARZfDL/gLA9N1I8ned/G8qvKmJLibwO0iUUS5BAoGAUHiDSWqBmlUJwEDQJMowCcQEsk2N8gQ+HwzTJhgP+TN3Yjha/MF0aHQw57DcWtAeMotOVVGtAzAfP1L2NJlWsOGbvO8bAOF7U5eNYM93Y2eDtb3oUsdWI6+C47MH2YHj1r4GTvGyio0DGMgjpLadWa9cwFB7/JEv4ZPMUwL4EFECgYAlFeTVV4S5ft2kR7kzWuKTRWFdLccR89QTiA5BwdCrEd93zL0IGk1B6j8MRE/mUNIxEaQBEBrvMNkLRAL56QbuUYgW2vhe+DcvcbP7aVUaDzMwAUNdkqGgaKxGOSVM6ukfAoXE7xMalo/rw52WJjkTqqJTBrQTr+eZIaVss9PvTg==";
        private const string alipayPublicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoKIwwrVyhvH8DxjAmqGWDNwwXevnfAzZmDAJI8HuOz1ucgtjBnHsoqQk3B1LItMf0slM3z6nKaqkgO9VQsde+H7UCssGs0U8fd2LUZITD0RHokKWRmhdCrc6xJZOBx//euhcN0ne4cgSdgxBEFhLOP2xdNzzsgCs31py8+s24um12/DNTBJ1JRmJ+EaJsErmxY92SHaQ9ur6lWR9rdLevC8RqT5gLl0ZArjnW+Bt90lqbPqhp49NruOe/b5LJgQSDr8kBJ3LAeWpxyz7kI2c281px1YjXMRPcqeHnGpFpWJN3LWsAtehjwbdSFK2Htdp0iTXUBZ/Qikh+nMWM+RadQIDAQAB";
            //"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs0ybQtwsb1HHlIxKxjBn8JnBuWTODger4uM1PbapZTL6p6hAGTsw4E0WXBLEFSNyWY3Ru0mZxqbklBybvRySnM2RN+8WeB/Brt72vxDtYt5NhdC/zY4IS5kk+VvBPNbAdXtnieftHxd69OqFElB7hjrhJcYm7I0orbydXjKpdK4ErdfPs7AncICSiUVlKFNSYh/5eqLhnREq/2TiD63E/AJ/gLCAHJiNqMx8jL2Qt8Z5DkwhSgC4PXr2fk7q1joo3O0CuxIAG/Do0NZbWSHrQUg0jGN6TF+3B3Jcdl7E8hhecQV5B5NTX/gNctYVho6iTOSUH2bfzohhD3sYBrbkawIDAQAB";
        public AlipaySystemOauthTokenResponse GetUserIdByCode(string authCode)
        {
            IAopClient client = new DefaultAopClient(
                "https://openapi.alipay.com/gateway.do",
                "2016101400686579",  //app_id
                privateKey,
                "json", "1.0", "RSA2",
                alipayPublicKey,
                "utf-8",
                false);
            AlipaySystemOauthTokenRequest request = new AlipaySystemOauthTokenRequest();
            request.GrantType = "authorization_code";
            request.Code = authCode;
            //request.RefreshToken = "201208134b203fe6c11548bcabd8da5bb087a83b";
            AlipaySystemOauthTokenResponse response = client.Execute(request);
            return response;
        }
    }
}
