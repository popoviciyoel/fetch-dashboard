import { FrownOutlined } from "@ant-design/icons"; // Optional: Lucide icon


export function NoResults({ message = "No results found.", suggestion = "Try adjusting your filters." }) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
        <FrownOutlined className="text-4xl mb-4" />
        <h2 className="text-lg font-semibold">{message}</h2>
        <p className="text-sm mt-1">{suggestion}</p>
      </div>
    );
  }