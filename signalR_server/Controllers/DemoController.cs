using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace signalR_server.Controllers {

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DemoController : ControllerBase {
        [HttpGet]
        public ActionResult<string> GetToken(string UserName) {
            return Utils.GenerateAccessToken(UserName);
        }

        [HttpPost]
        [Authorize]
        public ActionResult<string> CheckAuth(string data) {
            return data + " (Authorize) " + DateTime.Now.ToLongDateString();
        }

        [HttpPost]
        public ActionResult<string> WithoutAuth(string data) {
            return data + " (NO Authorize) " + DateTime.Now.ToLongDateString();
        }
    }

}
