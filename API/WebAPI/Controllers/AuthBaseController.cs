using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class AuthBaseController<T> : BaseController<T>
    {
        #region Protected Constructors

        protected AuthBaseController(ILogger<T> logger) : base(logger)
        {
        }

        #endregion Protected Constructors
    }
}