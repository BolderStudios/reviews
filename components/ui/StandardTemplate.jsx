"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getLocationData } from "@/app/actions";

export default function StandardTemplate() {
  const pathname = usePathname();
  const locationId = pathname.split("/")[3];
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const setLocationData = async (locationId) => {
      if (locationId) {
        const locationData = await getLocationData(locationId);
        setLocation(locationData.selectedLocation);
      }
    };
    setLocationData(locationId);
  }, [locationId]);

  const handleRating = (value) => {
    setRating(value);
    if (value >= 4) {
      // Redirect to Google or Yelp (you'll need to replace with actual URLs)
      router.push("https://google.com/review");
    } else {
      setShowFeedbackForm(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (you'll need to implement this)
    console.log({ rating, feedback, name, phone, email });
    // Reset form
    setFeedback("");
    setName("");
    setPhone("");
    setEmail("");
    setShowFeedbackForm(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        {/* <p className="text-2xl font-bold mb-4">Hey there! How'd we do?</p> */}
        {/* <p className="text-md mb-1 text-muted-foreground">
          Thank you for visiting {location?.organization_name}
        </p> */}
        <p className="text-md mb-1 text-muted-foreground">
          Hey there! How'd we do?
        </p>
        <p className="text-xl font-bold mb-4">
          We're always aiming to provide the best experience possible, and your
          opinion means the world to us.
        </p>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl mb-4">How was your visit today?</p>
        <div className="flex justify-center space-x-4">
          {["😕", "🙁", "😐", "🙂", "😃"].map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleRating(index + 1)}
              className="text-4xl focus:outline-none hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {showFeedbackForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Uh-oh, looks like we didn't knock your socks off.
          </h2>
          <p>
            We'd love a chance to make things right. Could you tell us a bit
            more about your experience? Your feedback is gold to us!
          </p>

          <div>
            <label htmlFor="feedback" className="block mb-2">
              What happened? How can we improve?
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            ></textarea>
          </div>

          <p>
            If you're comfortable, let us know how to reach you. We promise
            we're not just collecting numbers for our address book! 😉
          </p>

          <div>
            <label htmlFor="name" className="block mb-2">
              Your name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2">
              Best number to reach you:
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Email (if you prefer):
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Make It Right
          </button>
        </form>
      )}

      <p className="text-center mt-8">
        Thanks a million for helping us grow! Your input is the secret sauce to
        our success.
      </p>
    </div>
  );
}
