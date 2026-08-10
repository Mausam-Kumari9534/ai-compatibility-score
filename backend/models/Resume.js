const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Resume'
    },
    template: {
        type: String,
        default: 'Modern' // 'Classic', 'Modern', 'Minimal', 'Professional', 'SoftwareEngineer'
    },
    personalInfo: {
        fullName: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' }
    },
    summary: {
        type: String,
        default: ''
    },
    experience: [{
        id: { type: String }, // For drag and drop
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        location: { type: String },
        description: { type: String } // Bullet points or text
    }],
    education: [{
        id: { type: String },
        degree: { type: String },
        institution: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        score: { type: String }
    }],
    projects: [{
        id: { type: String },
        title: { type: String },
        technologies: { type: String },
        link: { type: String },
        description: { type: String }
    }],
    skills: {
        technical: { type: String, default: '' }, // comma separated or simple string
        soft: { type: String, default: '' }
    },
    certifications: [{
        id: { type: String },
        name: { type: String },
        issuer: { type: String },
        date: { type: String }
    }],
    achievements: {
        type: String,
        default: ''
    },
    languages: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
