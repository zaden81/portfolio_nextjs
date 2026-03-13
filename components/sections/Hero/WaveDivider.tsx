interface WaveDividerProps {
  fillColor?: string;
}

export default function WaveDivider({ fillColor = "#232323" }: WaveDividerProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
        <path
          fill={fillColor}
          d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,120L0,120Z"
        />
      </svg>
    </div>
  );
}
