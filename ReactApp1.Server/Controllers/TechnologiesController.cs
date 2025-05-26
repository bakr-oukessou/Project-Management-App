using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TechnologiesController : ControllerBase
    {
        private readonly ITechnologyService _technologyService;

        public TechnologiesController(ITechnologyService technologyService)
        {
            _technologyService = technologyService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var technologies = _technologyService.GetAll();
            return Ok(technologies);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var technology = _technologyService.GetById(id);
                return Ok(technology);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "Manager,Director")]
        public IActionResult Create([FromBody] Technology technology)
        {
            if (technology == null)
                return BadRequest();

            var created = _technologyService.Create(technology);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager,Director")]
        public IActionResult Update(int id, [FromBody] Technology updatedTechnology)
        {
            try
            {
                var updated = _technologyService.Update(id, updatedTechnology);
                return Ok(updated);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager,Director")]
        public IActionResult Delete(int id)
        {
            try
            {
                _technologyService.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("project/{projectId}")]
        public IActionResult GetByProject(int projectId)
        {
            var techs = _technologyService.GetByProject(projectId);
            return Ok(techs);
        }
    }
}
