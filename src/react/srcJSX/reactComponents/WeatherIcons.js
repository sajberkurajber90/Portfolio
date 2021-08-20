const WeatherIcons = function (props) {
  const id = props.id;
  switch (id) {
    case 'pressure':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 512 512"
          id="pressure"
        >
          <g>
            <path
              d="M256,0C114.51,0,0,114.497,0,256c0,141.491,114.497,256,256,256c141.49,0,256-114.497,256-256
          C512,114.509,397.503,0,256,0z M256,478.609c-122.746,0-222.609-99.862-222.609-222.609S133.254,33.391,256,33.391
			S478.609,133.254,478.609,256S378.746,478.609,256,478.609z"
            />
          </g>
          <path
            d="M256,66.783C151.29,66.783,66.783,151.738,66.783,256c0,48.619,18.872,97.248,55.421,133.797
        c6.52,6.52,17.091,6.52,23.611,0l23.611-23.611c6.52-6.519,6.52-17.09,0-23.611c-6.519-6.52-17.09-6.52-23.611,0l-11.177,11.177
        c-19.241-23.851-30.408-52.1-33.501-81.056h15.734c9.22,0,16.696-7.475,16.696-16.696c0-9.22-7.475-16.696-16.696-16.696h-15.725
        c3.094-28.955,14.261-57.198,33.5-81.05l11.17,11.169c6.52,6.52,17.091,6.52,23.611,0c6.519-6.519,6.519-17.091,0-23.611
        l-11.175-11.175c23.276-18.804,51.227-30.356,81.054-33.5v15.732c0,9.22,7.475,16.696,16.696,16.696
        c9.22,0,16.696-7.475,16.696-16.696v-15.731c29.827,3.144,57.777,14.698,81.054,33.5l-72.032,72.032
        c-7.699-4.03-16.444-6.323-25.719-6.323c-30.687,0-55.652,24.966-55.652,55.652c0,30.687,24.966,55.652,55.652,55.652
        c30.687,0,55.652-24.966,55.652-55.652c0-9.275-2.293-18.02-6.323-25.718l72.026-72.026c19.239,23.85,30.406,52.094,33.5,81.05
        H395.13c-9.22,0-16.696,7.475-16.696,16.696c0,9.22,7.475,16.696,16.696,16.696h15.734c-3.093,28.956-14.26,57.206-33.501,81.056
        l-11.177-11.177c-6.519-6.519-17.091-6.519-23.611,0c-6.52,6.52-6.52,17.091,0,23.611l23.611,23.611
        c6.52,6.52,17.091,6.52,23.611,0c36.482-36.483,55.421-85.084,55.421-133.798C445.217,151.681,360.676,66.783,256,66.783z
        M256,278.261c-12.275,0-22.261-9.986-22.261-22.261c0-12.275,9.986-22.261,22.261-22.261c12.275,0,22.261,9.986,22.261,22.261
        C278.261,268.275,268.275,278.261,256,278.261z"
          />
        </svg>
      );
    case 'humidity':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 328.611 328.611"
          id="humidity"
        >
          <path
            d="M209.306,50.798c-2.452-3.337-7.147-4.055-10.485-1.602c-3.338,2.453-4.055,7.147-1.603,10.485
		c54.576,74.266,66.032,123.541,66.032,151.8c0,27.691-8.272,52.794-23.293,70.685c-17.519,20.866-42.972,31.446-75.651,31.446
		c-73.031,0-98.944-55.018-98.944-102.131c0-52.227,28.103-103.234,51.679-136.829c25.858-36.847,52.11-61.415,52.37-61.657
		c3.035-2.819,3.209-7.565,0.39-10.6c-2.819-3.034-7.565-3.209-10.599-0.39c-1.11,1.031-27.497,25.698-54.254,63.765
		c-24.901,35.428-54.586,89.465-54.586,145.71c0,31.062,9.673,59.599,27.236,80.353c20.361,24.061,50.345,36.779,86.708,36.779
		c36.794,0,66.926-12.726,87.139-36.801c17.286-20.588,26.806-49.117,26.806-80.33C278.25,156.216,240.758,93.597,209.306,50.798z"
          />
          <path
            d="M198.43,148.146l-95.162,95.162c-2.929,2.929-2.929,7.678,0,10.606c1.465,1.464,3.385,2.197,5.304,2.197
		s3.839-0.732,5.304-2.197l95.162-95.162c2.929-2.929,2.929-7.678,0-10.606C206.107,145.217,201.359,145.217,198.43,148.146z"
          />
          <path
            d="M191.965,207.899c-13.292,0-24.106,10.814-24.106,24.106s10.814,24.106,24.106,24.106s24.106-10.814,24.106-24.106
		S205.257,207.899,191.965,207.899z M191.965,241.111c-5.021,0-9.106-4.085-9.106-9.106s4.085-9.106,9.106-9.106
		s9.106,4.085,9.106,9.106S196.986,241.111,191.965,241.111z"
          />
          <path
            d="M125.178,194.162c13.292,0,24.106-10.814,24.106-24.106s-10.814-24.106-24.106-24.106s-24.106,10.814-24.106,24.106
		S111.886,194.162,125.178,194.162z M125.178,160.949c5.021,0,9.106,4.085,9.106,9.106s-4.085,9.106-9.106,9.106
		c-5.021,0-9.106-4.085-9.106-9.106S120.156,160.949,125.178,160.949z"
          />
        </svg>
      );
    case 'wind':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 60 60"
          id="wind"
        >
          <path
            d="M44.688,10.462C45.349,13.416,46,17.502,46,20s-0.651,6.584-1.312,9.538l3.8-0.513C49.168,26.278,50,22.206,50,20
		s-0.832-6.278-1.513-9.024L44.688,10.462z"
          />
          <path
            d="M38.584,9.638C39.365,12.576,40,16.994,40,20s-0.635,7.424-1.416,10.362l3.986-0.539C43.248,27.011,44,22.55,44,20
		s-0.752-7.011-1.429-9.824L38.584,9.638z"
          />
          <path
            d="M56.073,12.001l-5.46-0.738C51.262,14.002,52,17.746,52,20s-0.738,5.998-1.387,8.737l5.46-0.738
		C57.574,27.965,60,26.848,60,20S57.574,12.035,56.073,12.001z"
          />
          <path
            d="M19.556,7.066C19.372,7.022,19.186,7,19,7c-0.969,0-1.797,0.581-2.49,1.55L6,16.057V9.899C8.279,9.434,10,7.414,10,5
		c0-2.757-2.243-5-5-5S0,2.243,0,5c0,2.414,1.721,4.434,4,4.899V48H2v6H0v6h10v-6H8v-6H6V20.414l9.797,9.797
		C16.603,31.916,17.671,33,19,33c0.186,0,0.372-0.022,0.556-0.066l16.868-2.279C37.2,28.158,38,23.368,38,20
		s-0.8-8.158-1.576-10.654L19.556,7.066z M8,58H2v-2h6V58z M4,54v-4h2v4H4z M21.979,21.238c-0.006,0.165-0.016,0.322-0.024,0.483
		c-0.011,0.229-0.021,0.46-0.036,0.681c-0.013,0.189-0.03,0.37-0.046,0.554c-0.016,0.184-0.031,0.369-0.049,0.547
		c-0.019,0.18-0.04,0.354-0.062,0.528c-0.021,0.176-0.043,0.352-0.067,0.521c-0.021,0.151-0.044,0.296-0.068,0.442
		c-0.031,0.192-0.062,0.383-0.095,0.567c-0.019,0.105-0.039,0.207-0.059,0.31c-0.044,0.226-0.09,0.448-0.139,0.659
		c-0.011,0.048-0.022,0.096-0.033,0.144c-0.467,1.974-1.095,3.301-1.647,3.921c0,0,0,0,0,0c-0.052,0.059-0.103,0.101-0.153,0.147
		c-0.036,0.032-0.073,0.069-0.109,0.095c-0.021,0.016-0.042,0.025-0.062,0.038c-0.009,0.006-0.018,0.009-0.027,0.015l-1.857-1.857
		C16.679,27.212,16,24.165,16,20c0-5.033,0.99-8.439,1.931-10.008l1.293-0.924c0.035,0.017,0.071,0.034,0.107,0.057
		c0.021,0.014,0.041,0.022,0.062,0.038c0.036,0.026,0.072,0.063,0.109,0.095c0.051,0.046,0.101,0.088,0.153,0.147c0,0,0,0,0,0
		c0.552,0.62,1.18,1.947,1.647,3.921c0.011,0.048,0.022,0.095,0.033,0.144c0.048,0.212,0.094,0.433,0.139,0.659
		c0.02,0.102,0.04,0.205,0.059,0.31c0.033,0.184,0.065,0.375,0.095,0.567c0.023,0.146,0.046,0.291,0.067,0.441
		c0.024,0.169,0.045,0.346,0.067,0.522c0.021,0.174,0.043,0.348,0.062,0.528c0.018,0.178,0.033,0.363,0.049,0.547
		c0.016,0.184,0.033,0.365,0.046,0.554c0.015,0.221,0.025,0.452,0.036,0.681c0.008,0.161,0.018,0.318,0.024,0.483
		C21.992,19.164,22,19.575,22,20S21.992,20.836,21.979,21.238z M2,5c0-1.654,1.346-3,3-3s3,1.346,3,3S6.654,8,5,8S2,6.654,2,5z
		 M6.542,18.127l8.409-6.006C14.322,14.408,14,17.21,14,20c0,2.116,0.188,4.237,0.551,6.137L6.542,18.127z"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default WeatherIcons;
