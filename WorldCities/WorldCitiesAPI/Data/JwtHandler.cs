﻿using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Data
{
    public class JwtHandler(
        IConfiguration configuration,
        UserManager<ApplicationUser> userManager)
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        public async Task<JwtSecurityToken> GetTokenAsync(ApplicationUser user)
        {
            return new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: await GetClaimsAsync(user),
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(
                    _configuration["JwtSettings:ExpirationTimeInMinutes"])),
                signingCredentials: GetSigningCredentials());
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(
                _configuration["JwtSettings:SecurityKey"]!);
            var secret = new SymmetricSecurityKey(key);
            
            return new SigningCredentials(secret,
                SecurityAlgorithms.HmacSha256);
        }

        private async Task<List<Claim>> GetClaimsAsync(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Email!)
            };

            foreach (var role in await _userManager.GetRolesAsync(user))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }
    }
}