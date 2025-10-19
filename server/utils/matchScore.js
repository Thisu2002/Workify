// server/utils/matchScore.js
const stringSimilarity = require("string-similarity");

function calculateMatchScore(job, candidate) {
  let score = 0;

  // ---- 1. Skills (max 40) ----
  const jobSkills = Array.isArray(job.skills) ? job.skills : [];
  const candSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
  const commonSkills = jobSkills.filter(s => candSkills.includes(s));
  const skillScore = jobSkills.length > 0 ? (commonSkills.length / jobSkills.length) * 40 : 0;

  // ---- 2. Experience (max 25) ----
  let expScore = 0;
  if (job.experience?.years && candidate.experience?.years) {
    const ratio = Math.min(candidate.experience.years / job.experience.years, 1);
    expScore = ratio * 25;
  }

  // ---- 3. Education (max 15) ----
  let eduScore = 0;
  if (Array.isArray(job.education_requirements) && job.education_requirements.length > 0 &&
      Array.isArray(candidate.education) && candidate.education.length > 0) {
    const jobEdu = job.education_requirements[0];
    const candEdu = candidate.education[0];

    const jobLevel = jobEdu.level?.toLowerCase() || "";
    const candDegree = candEdu.degree?.toLowerCase() || "";
    const jobField = jobEdu.field?.toLowerCase() || "";
    const candField = candEdu.school?.toLowerCase() || "";

    const levelMatch = stringSimilarity.compareTwoStrings(jobLevel, candDegree);
    const fieldMatch = stringSimilarity.compareTwoStrings(jobField, candField);

    const avgEduMatch = (levelMatch + fieldMatch) / 2;
    eduScore = avgEduMatch * 15;
  }

  // ---- 4. Required Qualifications (max 15) ----
  let qualScore = 0;
  if (Array.isArray(job.qualifications) && job.qualifications.length > 0) {
    const jobQuals = job.qualifications
      .map(q => (q?.name || "").toLowerCase().trim())
      .filter(Boolean);

    const candQuals = (candidate.qualifications || [])
      .map(q => (q?.name || "").toLowerCase().trim())
      .filter(Boolean);

    if (jobQuals.length > 0 && candQuals.length > 0) {
      let matchedCount = 0;
      jobQuals.forEach(jobQ => {
        const { bestMatch } = stringSimilarity.findBestMatch(jobQ, candQuals);
        if (bestMatch.rating >= 0.6) matchedCount++;
      });
      qualScore = (matchedCount / jobQuals.length) * 15;
    }
  }

  // ---- 5. Preferred Qualifications (max 5) ----
  let prefQualScore = 0;
  if (Array.isArray(job.preferred_qualifications) && job.preferred_qualifications.length > 0) {
    const jobPrefQuals = job.preferred_qualifications
      .map(q => (q?.name || "").toLowerCase().trim())
      .filter(Boolean);

    const candQuals = (candidate.qualifications || [])
      .map(q => (q?.name || "").toLowerCase().trim())
      .filter(Boolean);

    if (jobPrefQuals.length > 0 && candQuals.length > 0) {
      let matchedCount = 0;
      jobPrefQuals.forEach(jobQ => {
        const { bestMatch } = stringSimilarity.findBestMatch(jobQ, candQuals);
        if (bestMatch.rating >= 0.6) matchedCount++;
      });
      prefQualScore = (matchedCount / jobPrefQuals.length) * 5;
    }
  }

  // ---- Final score ----
  score = skillScore + expScore + eduScore + qualScore + prefQualScore;
  return Math.round(score);
}

module.exports = calculateMatchScore;
