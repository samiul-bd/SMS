using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));



IConfiguration Configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddScoped<Application.Interfaces.IAuthService, Infrastructure.Security.AuthService>();
builder.Services.AddScoped<Application.Interfaces.IAssignmentService, Infrastructure.Services.AssignmentService>();
builder.Services.AddScoped<Application.Interfaces.IAdminService, Infrastructure.Services.AdminService>();
builder.Services.AddScoped<Application.Interfaces.IStudentService, Infrastructure.Services.StudentService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

await app.RunAsync();