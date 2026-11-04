using System.ComponentModel.DataAnnotations;

namespace partcom.Application.DTOs.Auth;

public record RegisterRequest(
    [Required(ErrorMessage = "Email является обязательным полем.")]
    [EmailAddress(ErrorMessage = "Некорректный формат Email.")]
    string Email,

    [Required(ErrorMessage = "Пароль является обязательным полем.")]
    [MinLength(6, ErrorMessage = "Пароль должен быть не менее 6 символов.")]
    string Password,

    [Required(ErrorMessage = "Номер телефона является обязательным полем.")]
    [Phone(ErrorMessage = "Некорректный формат номера телефона.")]
    [RegularExpression(@"^\+?[1-9]\d{1,14}$", ErrorMessage = "Телефон должен быть в международном формате (например, +79991234567).")]
    string PhoneNumber,

    string? FirstName,
    string? LastName
);
