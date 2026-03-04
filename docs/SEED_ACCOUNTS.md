# Development Seed Accounts

These accounts are seeded only in `Development`.

## Global Role Accounts

| Role | Email | Password | Tenant |
| --- | --- | --- | --- |
| SystemAdmin | `admin@vitaent.local` | `Admin123!` | `vita-west` |
| ClinicAdmin | `clinic@vitaent.local` | `Clinic123!` | `vita-west` |
| Doctor | `doctor@vitaent.local` | `Doctor123!` | `vita-west` |
| Patient | `patient@vitaent.local` | `Patient123!` | `vita-west` |

Notes:

- `doctor@vitaent.local` has `Doctor` role and doctor profile in `vita-west`.
- `patient@vitaent.local` has `Patient` role and patient profile in `vita-west`.

## Seeded Clinics

- `VitaWest` (`vita-west`)
- `VitaSouth` (`vita-south`)
- `VitaNorth` (`vita-north`)
- `VitaCentral` (`vita-central`)

## Clinic Doctor Accounts

| Clinic | Email | Password | Tenant |
| --- | --- | --- | --- |
| VitaWest | `doctor.vitawest@vitaent.local` | `Doctor123!` | `vita-west` |
| VitaSouth | `doctor.vitasouth@vitaent.local` | `Doctor123!` | `vita-south` |
| VitaNorth | `doctor.vitanorth@vitaent.local` | `Doctor123!` | `vita-north` |
| VitaCentral | `doctor.vitacentral@vitaent.local` | `Doctor123!` | `vita-central` |

These clinic doctors are seeded with:

- active user
- active tenant membership
- `Doctor` role
- doctor profile

They can generate patient invitation codes immediately after backend startup.
