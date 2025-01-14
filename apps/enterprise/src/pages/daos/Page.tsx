import { ScrollableContainer, StickyHeader } from '@terra-money/apps/components';
import { PageLayout } from 'components/layout';
import { Navigation } from 'components/Navigation';
import { usePreviousIfEmpty } from 'hooks';
import { ResponsiveView } from 'lib/ui/ResponsiveView';
import { VStack } from 'lib/ui/Stack';
import { Text } from 'lib/ui/Text';
import { useDAOsQuery } from 'queries';
import { useRef, useState } from 'react';
import { DAO } from 'types';
import { Header } from './Header';
import { List } from './List';

const MAX_PREVIEW_SIZE = 30;

export const Page = () => {
  const stickyRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState({
    input: '',
    searchText: '',
  });

  const { data, isLoading } = useDAOsQuery({
    query: search.searchText,
    limit: MAX_PREVIEW_SIZE,
  });

  const items = usePreviousIfEmpty([...Array<DAO>(MAX_PREVIEW_SIZE)], data);

  return (
    <Navigation>
      <ResponsiveView
        small={() => (
          <VStack gap={24}>
            <Text size={24} weight="bold">
              DAOs
            </Text>
            <List items={items} isLoading={isLoading} />
          </VStack>
        )}
        normal={() => (
          <ScrollableContainer
            stickyRef={stickyRef}
            header={(visible) => (
              <StickyHeader visible={visible}>
                <Header
                  compact={true}
                  isLoading={isLoading}
                  totalCount={items?.length ?? 0}
                  searchText={search.input}
                  onSearchTextChange={(input) =>
                    setSearch((previous) => {
                      return {
                        ...previous,
                        input,
                      };
                    })
                  }
                  onSearch={() =>
                    setSearch((previous) => {
                      return {
                        ...previous,
                        searchText: previous.input,
                      };
                    })
                  }
                />
              </StickyHeader>
            )}
          >
            <PageLayout
              header={
                <Header
                  ref={stickyRef}
                  isLoading={isLoading}
                  totalCount={items?.length ?? 0}
                  searchText={search.input}
                  onSearchTextChange={(input) =>
                    setSearch((previous) => {
                      return {
                        ...previous,
                        input,
                      };
                    })
                  }
                  onSearch={() =>
                    setSearch((previous) => {
                      return {
                        ...previous,
                        searchText: previous.input,
                      };
                    })
                  }
                />
              }
            >
              <List items={items} isLoading={isLoading} />
            </PageLayout>
          </ScrollableContainer>
        )}
      />
    </Navigation>
  );
};
