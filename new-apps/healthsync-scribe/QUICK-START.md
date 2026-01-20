# 🚀 HealthSync Scribe - Quick Start Guide

## Get Your Platform Running in 5 Minutes

---

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for EHR integration, optional)
- Admin access (for configuration)

---

## ⚡ 1. First Launch

### Open the Application

When you first launch HealthSync Scribe, you'll see:

**✨ Setup Wizard** (automatic for new installations)

OR

**🏥 Main Dashboard** (if config already exists)

---

## 🧙 2. Setup Wizard (First-Time Users)

### Step 1: Welcome

Click **"Get Started"** to begin configuration.

### Step 2: Branding

**Required:**
- Enter your **Clinic Name** (e.g., "Smith Family Medicine")

**Optional:**
- Platform Name (default: "HealthSync Scribe")
- Tagline
- Choose a theme (Navy & Silver recommended)

Click **"Continue"**

### Step 3: Integration

**Choose your EHR system:**

For **testing/demo** → Select **"Standalone Mode"**

For **production** → Select your EHR:
- Epic
- Cerner
- athenahealth
- Allscripts
- eClinicalWorks
- NextGen
- Custom API

If you selected an EHR, enter:
- API Endpoint URL
- Enable FHIR (if supported)

Click **"Continue"**

### Step 4: Features

**Check the features you want to enable:**

Recommended for most clinics:
- ✅ AI Scribe
- ✅ Coding Assistant
- ✅ Care Gaps
- ✅ Patient Portal
- ✅ Telemedicine

Click **"Continue"**

### Step 5: Complete

Click **"Launch Platform"**

🎉 **Done!** Your platform is now configured.

---

## 🎯 3. Quick Configuration (Existing Users)

### Access Configuration

1. Click your profile in the **top-right**
2. Select **"Admin"** role
3. Navigate to **"Configuration"** in the left sidebar

### Make Changes

Choose a tab:
- **Branding** - Colors, logos, clinic name
- **EHR Integration** - Connect to your system
- **Workflow** - Specialties, visit types
- **Features** - Toggle modules on/off
- **Compliance** - Security settings
- **Notifications** - Email/SMS setup

### Save Changes

Click **"Save Changes"** (top-right)

---

## 📝 4. Common Configurations

### Scenario A: Standalone Clinic (No EHR)

```
Branding:
  Clinic Name: "Your Clinic Name Here"
  Theme: Navy & Silver

Integration:
  EHR System: None (Standalone Mode)

Features:
  ✅ AI Scribe
  ✅ Coding Assistant
  ✅ Patient Portal
  ❌ Lab Integration
  ❌ Imaging Integration
```

### Scenario B: Epic-Integrated Clinic

```
Branding:
  Clinic Name: "Your Clinic Name Here"
  Theme: Medical Blue

Integration:
  EHR System: Epic
  API Endpoint: https://fhir.epic.com/...
  FHIR: Enabled (R4)
  CDS Hooks: Enabled

Features:
  ✅ All Features Enabled
```

### Scenario C: Telehealth Only

```
Branding:
  Clinic Name: "Virtual Health Now"
  Theme: Nature Green

Integration:
  EHR System: Custom or Standalone

Features:
  ✅ Telemedicine
  ✅ E-Prescribing
  ✅ Patient Portal
  ❌ Lab Integration
  ❌ Imaging Integration
```

---

## 🔑 5. Test Your Configuration

### Switch Roles

1. Click profile (top-right)
2. Select different roles to test views:
   - **Provider** - Full clinical access
   - **MA** - Pre-visit, vitals, orders
   - **Front Desk** - Scheduling, check-in
   - **Admin** - Configuration access
   - **Patient** - Mobile patient portal

### Test Workflows

1. **Today's Queue** - View appointments
2. **Pre-Visit** - Patient preparation
3. **Active Visit** - AI scribe in action
4. **Draft Note** - Clinical documentation
5. **Coding** - ICD-10/CPT suggestions
6. **Orders** - Lab/Rx ordering

---

## 💾 6. Backup Your Configuration

### Export Config

1. Go to **Configuration** (any tab)
2. Click **"Export Config"**
3. Save the JSON file: `clinic-config-2024-01-11.json`

**Keep this file safe!** You can restore settings anytime.

### Import Config

1. Click **"Import Config"**
2. Select your JSON file
3. Configuration applied instantly

---

## 🎨 7. Customize Colors

### Quick Theme Change

1. **Configuration → Branding**
2. Select a preset theme:
   - **Navy & Silver** - Professional (default)
   - **Medical Blue** - Traditional
   - **Nature Green** - Wellness
   - **Warm Orange** - Friendly

### Custom Colors

1. **Configuration → Branding**
2. Use color pickers or enter hex codes:
   - Primary Color (main brand)
   - Secondary Color (neutrals)
   - Accent Color (highlights)
3. Click **"Save Changes"**

---

## 🔌 8. Connect Your EHR

### Epic Example

1. **Configuration → Integration**
2. Select **"Epic"**
3. Enter:
   ```
   API Endpoint: https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4
   Auth Type: OAuth 2.0
   FHIR Version: R4
   ```
4. Enable **FHIR Support**
5. Enable **CDS Hooks** (optional)
6. Click **"Save Changes"**
7. Configure OAuth credentials (see INTEGRATION-EXAMPLES.md)

### Custom API

1. **Configuration → Integration**
2. Select **"Custom API"**
3. Enter:
   ```
   API Endpoint: https://your-ehr.com/api/v1
   Auth Type: API Key (or OAuth 2.0)
   ```
4. Click **"Save Changes"**
5. Implement adapter (see INTEGRATION-EXAMPLES.md)

---

## 🔒 9. Enable Security Features

### Recommended Settings

1. **Configuration → Compliance**
2. Enable:
   - ✅ **HIPAA Compliance Mode**
   - ✅ **Require Multi-Factor Authentication**
   - ✅ **Comprehensive Audit Logging**
3. Set:
   - Session Timeout: **30 minutes**
   - Password Min Length: **12 characters**
   - Password Expiry: **90 days**
4. Click **"Save Changes"**

---

## 📱 10. Patient Portal

### Enable Patient Access

1. **Configuration → Features**
2. Enable **"Patient Portal"**
3. Click **"Save Changes"**

### Access Patient View

1. Click profile (top-right)
2. Select **"Patient"** role
3. See mobile-optimized patient experience

### Return to Provider View

Click **"Back to Provider View"** (bottom of patient portal)

---

## ✅ Quick Checklist

Essential steps for production use:

- [ ] Complete setup wizard OR import config
- [ ] Configure clinic branding
- [ ] Set up EHR integration (if applicable)
- [ ] Enable required features
- [ ] Configure HIPAA/security settings
- [ ] Test with sample patient
- [ ] Export configuration backup
- [ ] Train staff on workflows

---

## 🆘 Common Issues

### Issue: Setup Wizard Not Appearing

**Solution:** 
- Wizard only shows for first-time users
- To re-run: Admin → Configuration → Reset to Defaults

### Issue: Can't Save Changes

**Solution:**
- Ensure you're in **Admin** role
- Check browser console for errors
- Try exporting/importing config

### Issue: EHR Connection Failing

**Solution:**
- Verify API endpoint URL
- Check authentication credentials
- See INTEGRATION-EXAMPLES.md for detailed setup

### Issue: Features Not Appearing

**Solution:**
- Configuration → Features
- Enable desired features
- Save changes
- Refresh page

---

## 📚 Next Steps

### Learn More

- **[CUSTOMIZATION-GUIDE.md](./CUSTOMIZATION-GUIDE.md)** - Complete customization guide
- **[INTEGRATION-EXAMPLES.md](./INTEGRATION-EXAMPLES.md)** - EHR integration examples
- **[API-REFERENCE.md](./API-REFERENCE.md)** - API documentation
- **[PLATFORM-OVERVIEW.md](./PLATFORM-OVERVIEW.md)** - Platform overview

### Advanced Configuration

1. **Add Specialties**
   - Configuration → Workflow
   - Type specialty name → Add
   
2. **Customize Visit Types**
   - Configuration → Workflow
   - Modify durations and requirements

3. **Set Up Notifications**
   - Configuration → Notifications
   - Configure email/SMS providers

4. **Manage Roles**
   - Configuration → Roles (Advanced)
   - Create custom roles with permissions

---

## 🎉 You're All Set!

Your HealthSync Scribe platform is configured and ready to use.

**Start using:**
1. View **Today's Queue**
2. Select a patient
3. Start documenting with **AI Scribe**
4. Complete visit workflow
5. Generate billing codes
6. Send **Patient AVS**

---

## 💡 Pro Tips

### Tip 1: Role Switching
Quickly test different user experiences by switching roles in the top-right dropdown.

### Tip 2: Configuration Backups
Export your config weekly as backup. Store in version control.

### Tip 3: Gradual Rollout
Enable features one at a time for easier staff training.

### Tip 4: Mobile Testing
Switch to Patient role to see mobile portal experience.

### Tip 5: Integration Testing
Use standalone mode first, then connect EHR once workflows are familiar.

---

**Need Help?** Check the comprehensive guides:
- Customization: [CUSTOMIZATION-GUIDE.md](./CUSTOMIZATION-GUIDE.md)
- Integration: [INTEGRATION-EXAMPLES.md](./INTEGRATION-EXAMPLES.md)
- API: [API-REFERENCE.md](./API-REFERENCE.md)

---

🚀 **Happy Documenting!**
