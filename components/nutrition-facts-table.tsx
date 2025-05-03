"use client"

export default function NutritionFactsTable() {
  const nutritionData = [
    { name: "Calories", amount: "240", dailyValue: "12%" },
    { name: "Total Fat", amount: "12g", dailyValue: "15%" },
    { name: "Saturated Fat", amount: "3g", dailyValue: "15%", indent: true },
    { name: "Trans Fat", amount: "0g", dailyValue: "", indent: true },
    { name: "Cholesterol", amount: "0mg", dailyValue: "0%" },
    { name: "Sodium", amount: "140mg", dailyValue: "6%" },
    { name: "Total Carbohydrate", amount: "30g", dailyValue: "11%" },
    { name: "Dietary Fiber", amount: "2g", dailyValue: "7%", indent: true },
    { name: "Total Sugars", amount: "15g", dailyValue: "", indent: true },
    { name: "Added Sugars", amount: "15g", dailyValue: "30%", indent: true, highlight: true },
    { name: "Protein", amount: "5g", dailyValue: "10%" },
    { name: "Vitamin D", amount: "0mcg", dailyValue: "0%" },
    { name: "Calcium", amount: "20mg", dailyValue: "2%" },
    { name: "Iron", amount: "1.8mg", dailyValue: "10%" },
    { name: "Potassium", amount: "125mg", dailyValue: "2%" },
  ]

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-bold">Nutrition Facts</h3>
        <p className="text-sm text-gray-500">Serving Size 1 package (30g)</p>
      </div>
      <div className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left font-normal pb-1">Amount Per Serving</th>
              <th className="text-right font-normal pb-1"></th>
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((item, index) => (
              <tr
                key={index}
                className={`
                  ${index === 0 ? "border-b border-black" : "border-b border-gray-200"} 
                  ${item.highlight ? "bg-yellow-50" : ""}
                `}
              >
                <td className={`py-1 ${item.indent ? "pl-4" : "font-medium"}`}>{item.name}</td>
                <td className="py-1 text-right">
                  <div className="flex items-center justify-end">
                    <span className="font-medium">{item.amount}</span>
                    {item.dailyValue && <span className="text-gray-500 ml-4 w-12 text-right">{item.dailyValue}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">* Percent Daily Values are based on a 2,000 calorie diet.</p>
      </div>
    </div>
  )
}
