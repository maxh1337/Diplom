import type { IEvent } from "../../../lib/modules/event/event.types";
import Event from "../../events/components/Event";

export default function UpcomingEvents() {
  const events: IEvent[] = [
    {
      id: "12",
      image:
        "https://web3.avolites.com/Portals/0/news/2016%20v2/Jewel/5.21_The%20Chainsmokers_JEWEL%20Grand%20Opening_Photo%20Credit%20Al%20Powers%206.jpg?ver=2016-08-05-114212-697",
      title: "Test1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In malesuada sem a ullamcorper pulvinar. In metus leo, iaculis vitae congue ac, mattis ac enim. Etiam maximus dui ac fringilla auctor. Morbi vel quam vel elit vulputate dignissim quis porta nulla. Vestibulum vulputate urna vel neque imperdiet ullamcorper. Fusce a faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In malesuada sem a ullamcorper pulvinar. In metus leo, iaculis vitae congue ac, mattis ac enim. Etiam maximus dui ac fringilla auctor. Morbi vel quam vel elit vulputate dignissim quis porta nulla. Vestibulum vulputate urna vel neque imperdiet ullamcorper. Fusce a faucibus.",
      hashTags: ["ЮЗГУ", "Дискотека", "Музыка", "Культура", "Досуг"],
      createdAt: "Created_at_1",
      participants: 1,
      feedback: [
        {
          id: "1",
          rating: 5,
        },
      ],
    },
    {
      id: "13",
      image:
        "https://web3.avolites.com/Portals/0/news/2016%20v2/Jewel/5.21_The%20Chainsmokers_JEWEL%20Grand%20Opening_Photo%20Credit%20Al%20Powers%206.jpg?ver=2016-08-05-114212-697",
      title: "Test2",
      description: "Описание 2",
      hashTags: ["ЮЗГУ", "Дискотека", "Музыка", "Культура", "Досуг"],
      createdAt: "Created_at_2",
      participants: 2,
      feedback: [
        {
          id: "2",
          rating: 5,
        },
      ],
    },
    {
      id: "14",
      image:
        "https://web3.avolites.com/Portals/0/news/2016%20v2/Jewel/5.21_The%20Chainsmokers_JEWEL%20Grand%20Opening_Photo%20Credit%20Al%20Powers%206.jpg?ver=2016-08-05-114212-697",
      title: "Test3",
      description: "Описание 3",
      hashTags: ["ЮЗГУ", "Дискотека", "Музыка", "Культура", "Досуг"],
      createdAt: "Created_at_3",
      participants: 3,
      feedback: [
        {
          id: "3",
          rating: 5,
        },
      ],
    },
  ];

  return (
    <section className=" w-full flex mt-6 flex-col">
      <h1 className=" text-white font-brain text-xl">Ближайшие мероприятия</h1>
      <div>
        {events.map((event, idx) => (
          <Event event={event} key={idx} />
        ))}
      </div>
    </section>
  );
}
