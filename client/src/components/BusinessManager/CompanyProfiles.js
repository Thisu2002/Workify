import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "../../styles/CompanyProfiles.css";
import {
  Search,
  Briefcase,
  Users,
  UserCheck,
  Star,
  Calendar,
  Shield,
  ArrowLeft,
} from "lucide-react";

const CompanyGridView = ({ companies, searchTerm, onSearchChange, onSelectCompany }) => (
  <div className="company-grid-view">
    <div className="toolbar">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search companies by name..."
          className="search-input"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
    </div>
    <div className="profiles-grid">
      {companies.map((company) => (
        <div
          key={company._id}
          className="profile-card"
          onClick={() => onSelectCompany(company)}
        >
          <img
            src={
              company.logo ||
              "https://cdn-icons-png.flaticon.com/512/888/888859.png"
            }
            alt={`${company.name} logo`}
            className="profile-logo"
          />
          <h3 className="profile-name">{company.name}</h3>
          <p className="profile-position">{company.location}</p>
        </div>
      ))}
    </div>
  </div>
);

const CompanyDetailView = ({ company, onBack }) => (
  <div className="company-detail-view">
    <button onClick={onBack} className="back-button">
      <ArrowLeft size={20} /> Back to All Companies
    </button>
    <div className="detail-header">
      <img
        src={
          company.logo ||
          "https://cdn-icons-png.flaticon.com/512/888/888859.png"
        }
        alt={`${company.name} logo`}
        className="detail-header-logo"
      />
      <div className="detail-header-info">
        <h1 className="detail-company-name">{company.name}</h1>
        <p className="detail-company-location">{company.location}</p>
        {company.website && (
          <a
            href={
              company.website.startsWith("http")
                ? company.website
                : `http://${company.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="detail-company-website"
          >
            {company.website}
          </a>
        )}
      </div>
    </div>
    <p className="detail-company-description">{company.description}</p>
  </div>
);

const CompanyProfilesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const { companyId } = useParams();

  useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5000/manager/companies");
      const data = await response.json();
      setCompanies(data);
      setLoading(false);

      if (companyId) {
        const selected = data.find(c => c._id === companyId);
        if (selected) setSelectedCompany(selected);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setLoading(false);
    }
  };

  fetchCompanies();
}, [companyId]);


  const filteredCompanies = useMemo(
    () =>
      companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [companies, searchTerm]
  );

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading companies...</p>;
  }

  return (
    <div className="company-profiles-container">
      {selectedCompany ? (
        <CompanyDetailView
          company={selectedCompany}
          onBack={() => setSelectedCompany(null)}
        />
      ) : (
        <CompanyGridView
          companies={filteredCompanies}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSelectCompany={setSelectedCompany}
        />
      )}
    </div>
  );
};

export default CompanyProfilesPage;
