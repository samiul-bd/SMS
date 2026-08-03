using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController<T> : ControllerBase
    {
        #region Protected Fields

        protected readonly ILogger<T> _logger;

        #endregion Protected Fields

        #region Private Fields

        private IMediator _mediator = null!;

        #endregion Private Fields

        #region Protected Constructors

        protected BaseController(ILogger<T> logger)
        {
            _logger = logger;
        }

        #endregion Protected Constructors

        #region Protected Properties

        protected IMediator MediatorObject => _mediator ??= HttpContext.RequestServices.GetService<IMediator>()!;

        #endregion Protected Properties
    }
}