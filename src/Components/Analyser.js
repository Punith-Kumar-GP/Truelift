import React, { useState } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import "../Css/Analyser.css";

const CampaignTimeline = () => {
  const [preCampaignRange, setPreCampaignRange] = useState(null);
  const [campaignRange, setCampaignRange] = useState(null);
  const [preCampaignWidth, setPreCampaignWidth] = useState(0);
  const [campaignWidth, setCampaignWidth] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [subsetName, setSubsetName] = useState("");
  const [userPreCampaignRange, setUserPreCampaignRange] = useState(null);
  const [userCampaignRange, setUserCampaignRange] = useState(null);
  const [minPreCampaignEnd, setMinPreCampaignEnd] = useState("");
  const [minCampaignEnd, setMinCampaignEnd] = useState("");
  const [formPreCampaignStart, setFormPreCampaignStart] = useState("");
  const [formPreCampaignEnd, setFormPreCampaignEnd] = useState("");
  const [formCampaignStart, setFormCampaignStart] = useState("");
  const [formCampaignEnd, setFormCampaignEnd] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const data = result.data;

         
          const preCampaignDates = data
            .filter((row) => row["campaign"] === "0")
            .map((row) => new Date(row["date"]));

          const preCampaignStart = new Date(Math.min(...preCampaignDates));
          const preCampaignEnd = new Date(Math.max(...preCampaignDates));

          const campaignDates = data
            .filter((row) => row["campaign"] === "1")
            .map((row) => new Date(row["date"]));

          const campaignStart = new Date(Math.min(...campaignDates));
          const campaignEnd = new Date(Math.max(...campaignDates));

     
          const preCampaignDuration =
            (preCampaignEnd - preCampaignStart) / (1000 * 60 * 60 * 24);
          const campaignDuration =
            (campaignEnd - campaignStart) / (1000 * 60 * 60 * 24);

          const totalDuration = preCampaignDuration + campaignDuration;

          setPreCampaignWidth((preCampaignDuration / totalDuration) * 100);
          setCampaignWidth((campaignDuration / totalDuration) * 100);

      
          setPreCampaignRange({ start: preCampaignStart, end: preCampaignEnd });
          setCampaignRange({ start: campaignStart, end: campaignEnd });

          setFormPreCampaignStart(preCampaignStart.toISOString().split("T")[0]);
          setFormPreCampaignEnd(preCampaignEnd.toISOString().split("T")[0]);
          setFormCampaignStart(campaignStart.toISOString().split("T")[0]);
          setFormCampaignEnd(campaignEnd.toISOString().split("T")[0]);
        },
      });
    },
  });

  const handlePreCampaignStartChange = (event) => {
    const startDate = new Date(event.target.value);
    setMinPreCampaignEnd(startDate.toISOString().split("T")[0]);
  };

  const handleCampaignStartChange = (event) => {
    const startDate = new Date(event.target.value);
    setMinCampaignEnd(startDate.toISOString().split("T")[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const preCampaignStart = new Date(event.target.preCampaignStart.value);
    const preCampaignEnd = new Date(event.target.preCampaignEnd.value);
    const campaignStart = new Date(event.target.campaignStart.value);
    const campaignEnd = new Date(event.target.campaignEnd.value);

    setUserPreCampaignRange({ start: preCampaignStart, end: preCampaignEnd });
    setUserCampaignRange({ start: campaignStart, end: campaignEnd });
    setSubsetName(event.target.subsetName.value);


    setShowForm(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  };

  return (
    <div >
    <div className="Drag-drop">
    <p>Upload a .CSV file</p>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a CSV file here, or click to select one</p>
      </div>
      </div>
      {preCampaignRange && campaignRange && (
        <div className="Parent">
          <div className="timeline-container">
            <div
              className={`timeline-block pre-campaign`}
              style={{ width: `${preCampaignWidth}%` }}
            >
              <div className="dates">
                {formatDate(preCampaignRange.start)} -{" "}
                {formatDate(preCampaignRange.end)}
              </div>
            </div>
            <div
              className={`timeline-block campaign`}
              style={{ width: `${campaignWidth}%` }}
            >
              <div className="dates">
                {formatDate(campaignRange.start)} -{" "}
                {formatDate(campaignRange.end)}
              </div>
            </div>
          </div>
          <button className="Create-Subset" onClick={() => setShowForm(true)}>
            Create Subset
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Pre-Campaign Start Date:</label>
            <input
              type="date"
              name="preCampaignStart"
              min={preCampaignRange.start.toISOString().split("T")[0]}
              max={preCampaignRange.end.toISOString().split("T")[0]}
              value={formPreCampaignStart}
              onChange={(e) => {
                setFormPreCampaignStart(e.target.value);
                handlePreCampaignStartChange(e);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Pre-Campaign End Date:</label>
            <input
              type="date"
              name="preCampaignEnd"
              min={minPreCampaignEnd || preCampaignRange.start.toISOString().split("T")[0]}
              max={preCampaignRange.end.toISOString().split("T")[0]}
              value={formPreCampaignEnd}
              onChange={(e) => setFormPreCampaignEnd(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Campaign Start Date:</label>
            <input
              type="date"
              name="campaignStart"
              min={campaignRange.start.toISOString().split("T")[0]}
              max={campaignRange.end.toISOString().split("T")[0]}
              value={formCampaignStart}
              onChange={(e) => {
                setFormCampaignStart(e.target.value);
                handleCampaignStartChange(e);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Campaign End Date:</label>
            <input
              type="date"
              name="campaignEnd"
              min={minCampaignEnd || campaignRange.start.toISOString().split("T")[0]}
              max={campaignRange.end.toISOString().split("T")[0]}
              value={formCampaignEnd}
              onChange={(e) => setFormCampaignEnd(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Subset Name:</label>
            <input
              type="text"
              name="subsetName"
              value={subsetName}
              onChange={(e) => setSubsetName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}

      {preCampaignRange &&
        campaignRange &&
        userPreCampaignRange &&
        userCampaignRange && (
          <div className="Subset" style={{ marginTop: "20px" }}>
            <h3>{subsetName}</h3>
            <div className="timeline-container">
              <div
                className={`timeline-block pre-campaign`}
                style={{ width: `${preCampaignWidth}%` }}
              >
                <div className="dates">
                  {formatDate(preCampaignRange.start)} -{" "}
                  {formatDate(preCampaignRange.end)}
                </div>
                {userPreCampaignRange && (
                  <div
                    className="highlight"
                    style={{
                      left: `${
                        ((userPreCampaignRange.start - preCampaignRange.start) /
                          (preCampaignRange.end - preCampaignRange.start)) *
                        100
                      }%`,
                      right: `${
                        100 -
                        ((userPreCampaignRange.end - preCampaignRange.start) /
                          (preCampaignRange.end - preCampaignRange.start)) *
                          100
                      }%`,
                    
                      
                    }}
                  ></div>
                )}
              </div>
              <div
                className={`timeline-block campaign`}
                style={{ width: `${campaignWidth}%` }}
              >
                <div className="dates">
                  {formatDate(campaignRange.start)} -{" "}
                  {formatDate(campaignRange.end)}
                </div>
                {userCampaignRange && (
                  <div
                    className="highlight"
                    style={{
                      left: `${
                        ((userCampaignRange.start - campaignRange.start) /
                          (campaignRange.end - campaignRange.start)) *
                        100
                      }%`,
                      right: `${
                        100 -
                        ((userCampaignRange.end - campaignRange.start) /
                          (campaignRange.end - campaignRange.start)) *
                          100
                      }%`,
                    
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CampaignTimeline;
