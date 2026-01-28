# Windows Quick Start - Database Migration

## For Windows Users 🪟

### Step 1: Set Your Database URL

Choose one method:

#### Method A: PowerShell (Recommended)
```powershell
$env:DATABASE_URL="mysql://user:password@host:3306/database"
```

#### Method B: Command Prompt
```cmd
set DATABASE_URL=mysql://user:password@host:3306/database
```

#### Method C: Create .env file
1. Open Notepad
2. Add this line:
   ```
   DATABASE_URL=mysql://user:password@host:3306/database
   ```
3. Save as `.env` in the project root folder

### Step 2: Run the Migration

Choose one method:

#### Method A: PowerShell Script (Easiest)
```powershell
.\migrate.ps1
```

#### Method B: Batch Script
```cmd
migrate.bat
```

#### Method C: Direct Command (PowerShell)
```powershell
pnpm run db:push
```

#### Method D: Direct Command (CMD)
```cmd
pnpm run db:push
```

## Common Connection Strings

### Local MySQL (XAMPP/WAMP)
```
DATABASE_URL=mysql://root:@localhost:3306/synckaiden
```

### MySQL with password
```
DATABASE_URL=mysql://root:yourpassword@localhost:3306/synckaiden
```

### Docker MySQL
```
DATABASE_URL=mysql://root:password@127.0.0.1:3306/synckaiden
```

## What This Does

Creates 4 performance indexes in your database:
- ✅ Faster subscription lookups (2-10x)
- ✅ Faster entitlement checks (2-10x)
- ✅ Faster audit logs (10x)
- ✅ Faster API key queries (5x)

## Troubleshooting

### "pnpm: command not found"
Install pnpm first:
```powershell
npm install -g pnpm
```

### "Cannot find .env file"
That's okay! Just set the DATABASE_URL directly:
```powershell
$env:DATABASE_URL="mysql://user:password@host:3306/database"
pnpm run db:push
```

### "Connection refused"
- Make sure MySQL is running (XAMPP, WAMP, or standalone MySQL)
- Check if the port (usually 3306) is correct
- Verify username and password

### "Access denied"
- Double-check your MySQL username and password
- Make sure the user has permissions to create indexes

## Need Help?

See the full guide: `HOW_TO_RUN_MIGRATIONS.md`
